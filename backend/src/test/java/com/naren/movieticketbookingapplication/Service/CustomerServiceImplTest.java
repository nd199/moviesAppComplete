package com.naren.movieticketbookingapplication.Service;

import com.naren.movieticketbookingapplication.Controller.RegVerifyController;
import com.naren.movieticketbookingapplication.Dao.CustomerDao;
import com.naren.movieticketbookingapplication.Dao.MovieDao;
import com.naren.movieticketbookingapplication.Dto.CustomerDTO;
import com.naren.movieticketbookingapplication.Dto.CustomerDTOMapper;
import com.naren.movieticketbookingapplication.Entity.Customer;
import com.naren.movieticketbookingapplication.Entity.Movie;
import com.naren.movieticketbookingapplication.Entity.Role;
import com.naren.movieticketbookingapplication.Exception.PasswordInvalidException;
import com.naren.movieticketbookingapplication.Exception.RequestValidationException;
import com.naren.movieticketbookingapplication.Exception.ResourceAlreadyExists;
import com.naren.movieticketbookingapplication.Exception.ResourceNotFoundException;
import com.naren.movieticketbookingapplication.Record.CustomerRegistration;
import com.naren.movieticketbookingapplication.Record.CustomerUpdateRequest;
import com.naren.movieticketbookingapplication.Utils.EmailService;
import com.naren.movieticketbookingapplication.Utils.OtpService;
import com.naren.movieticketbookingapplication.jwt.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomerServiceImplTest {

    private final CustomerDTOMapper customerDTOMapper = new CustomerDTOMapper();

    @Mock
    private CustomerDao customerDao;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private RoleService roleService;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private MovieDao movieDao;

    private CustomerServiceImpl underTest;

    private EmailService emailService;

    private OtpService otpService;

    private RegVerifyController controller;

    @BeforeEach
    void setUp() {
        underTest = new CustomerServiceImpl(
                customerDao, passwordEncoder, customerDTOMapper, roleService,
                movieDao, jwtUtil, otpService);

    }

    @Test
    void registerCustomerSuccess() {
        String email = "test@example.com";
        String password = "password";
        String encodedPassword = passwordEncoder.encode(password);
        CustomerRegistration registration = new CustomerRegistration("test",
                email, password, 22222222222L, "", false, "Chennai, India", false, false);

        when(customerDao.existsByEmail(email)).thenReturn(false);
        when(customerDao.existsByPhoneNumber(registration.phoneNumber())).thenReturn(false);
        when(passwordEncoder.encode(password)).thenReturn(encodedPassword);

        Role role = new Role("ROLE_USER");
        when(roleService.findRoleByName(role.getName())).thenReturn(role);
        ResponseEntity<?> response = underTest.registerUser(registration, Set.of("ROLE_USER"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        underTest.registerUser(registration, Set.of(String.valueOf(role)));

        ArgumentCaptor<Customer> customerArgumentCaptor = ArgumentCaptor.forClass(Customer.class);
        verify(customerDao).addCustomer(customerArgumentCaptor.capture());

        Customer capturedCustomer = customerArgumentCaptor.getValue();
        assertThat(capturedCustomer.getEmail()).isEqualTo(email);
        assertThat(capturedCustomer.getName()).isEqualTo("test");
        assertThat(capturedCustomer.getPassword()).isEqualTo(encodedPassword);
        assertThat(capturedCustomer.getPhoneNumber()).isEqualTo(22222222222L);
        assertThat(capturedCustomer.getIsEmailVerified()).isEqualTo(true);
        assertThat(capturedCustomer.getAddress()).isEqualTo("Chennai, India");
        verify(roleService).findRoleByName("ROLE_USER");
        assertThat(capturedCustomer.getRoles()).contains(role);
        assertThat(response.getBody()).isEqualTo(customerDTOMapper.apply(capturedCustomer));
    }

    @Test
    void registerUser_InvalidRoleName_ReturnsBadRequest() {

        CustomerRegistration registration = new CustomerRegistration("John Doe", "johndoe@example.com", "password", 1234567890L, "", false, "Chennai, India", false, false);
        Set<String> roleNames = new HashSet<>();
        roleNames.add("INVALID_ROLE");

        when(roleService.findRoleByName("INVALID_ROLE")).thenReturn(null);

        ResponseEntity<?> response = underTest.registerUser(registration, roleNames);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isEqualTo("Role INVALID_ROLE not found");

        verify(roleService).findRoleByName("INVALID_ROLE");
    }

    @Test
    void registerCustomerPersonalInfoInPasswordThrowsException() {
        CustomerRegistration registration = new CustomerRegistration("testName", "testEmail", "testName123", 1234567890L, "", false, "Chennai, India", false, false);

        assertThatThrownBy(() -> underTest.registerUser(registration, Set.of()))
                .isInstanceOf(PasswordInvalidException.class)
                .hasMessage("Password must not contain personal info [Name,Email,Phone] ");

        verify(customerDao, never()).addCustomer(any());
    }

    @Test
    void registerCustomerInvalidPasswordLengthThrowsException() {
        CustomerRegistration registration = new CustomerRegistration("testName", "test@example.com", "pass", 20220292232L, "", false, "Chennai, India", false, false);

        assertThatThrownBy(() -> underTest.registerUser(registration, Set.of()))
                .isInstanceOf(PasswordInvalidException.class)
                .hasMessage("Password must be at least 8 characters long");

        verify(customerDao, never()).addCustomer(any());
    }

    @Test
    void registerCustomerEmailAlreadyExistsThrowsException() {
        String email = "test@example.com";
        when(customerDao.existsByEmail(email)).thenReturn(true);

        CustomerRegistration registration = new CustomerRegistration("testName", email, "testpassword", 20220292232L, "", false, "Chennai, India", false, false);

        assertThatThrownBy(() -> underTest.registerUser(registration, Set.of()))
                .isInstanceOf(ResourceAlreadyExists.class)
                .hasMessage("Email already taken");

        verify(customerDao, never()).addCustomer(any());
    }

    @Test
    void registerCustomerPhoneNumberAlreadyExistsThrowsResourceAlreadyExistsException() {

        CustomerRegistration registration =
                new CustomerRegistration("testName", "test@example.com",
                        "testPassword", 1234567890L, "", false, "Chennai, India", false, false);
        when(customerDao.existsByPhoneNumber(registration.phoneNumber())).thenReturn(true);

        assertThatThrownBy(() -> underTest.registerUser(registration, Set.of()))
                .isInstanceOf(ResourceAlreadyExists.class)
                .hasMessage("Phone number already taken");

        verify(customerDao, never()).addCustomer(any());
    }

    @Test
    void getCustomerByIdReturnsCustomerDTO() {
        long customerId = 1;
        Customer customer = new Customer(customerId, "Alex", "alex@example.com",
                "password", 1234567890L, false, false, false, "Chennai, India", false);
        when(customerDao.getCustomer(customerId)).thenReturn(Optional.of(customer));

        CustomerDTO result = underTest.getCustomerById(customerId);

        assertThat(result).isNotNull();
        assertThat(result.name()).isEqualTo("Alex");
        assertThat(result.email()).isEqualTo("alex@example.com");
        assertThat(result.phoneNumber()).isEqualTo(1234567890L);
    }

    @Test
    void getCustomerByIdNonExistingCustomerIdThrowsException() {
        long nonExistingCustomerId = 100;
        when(customerDao.getCustomer(nonExistingCustomerId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.getCustomerById(nonExistingCustomerId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Customer with ID 100 not found");

        verify(customerDao).getCustomer(nonExistingCustomerId);
    }

    @Test
    void updateCustomerSuccessful() {
        long customerId = 1;
        Customer customer = new Customer(customerId, "testName", "test@example.com", "oldPassword", 20220292232L, false, false, false, "Chennai, India", false);
        CustomerUpdateRequest updateRequest = new CustomerUpdateRequest("newName", "new@example.com", 9999999999L, "", false, "Chennai, India", false, false);

        when(customerDao.getCustomer(customerId)).thenReturn(Optional.of(customer));
        when(customerDao.existsByEmail(updateRequest.email())).thenReturn(false);

        underTest.updateCustomer(updateRequest, customerId);

        ArgumentCaptor<Customer> customerArgumentCaptor = ArgumentCaptor.forClass(Customer.class);
        verify(customerDao).updateCustomer(customerArgumentCaptor.capture());

        Customer updatedCustomer = customerArgumentCaptor.getValue();
        assertThat(updatedCustomer.getName()).isEqualTo("newName");
        assertThat(updatedCustomer.getEmail()).isEqualTo("new@example.com");
        assertThat(updatedCustomer.getPhoneNumber()).isEqualTo(9999999999L);
    }

    @Test
    void updateCustomerNonExistingCustomerIdThrowsException() {
        long nonExistingCustomerId = 100;
        CustomerUpdateRequest updateRequest = new CustomerUpdateRequest("newName", "new@example.com", 9999999999L, "", false, "Chennai, India", false, false);

        when(customerDao.getCustomer(nonExistingCustomerId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.updateCustomer(updateRequest, nonExistingCustomerId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Customer with ID 100 not found");

        verify(customerDao).getCustomer(nonExistingCustomerId);
        verify(customerDao, never()).updateCustomer(any());
    }

    @Test
    void updateCustomerEmailAlreadyExistsThrowsResourceAlreadyExists() {
        long customerId = 1;
        String existingEmail = "existing@example.com";
        Customer existingCustomer = new Customer(customerId, "John Doe", existingEmail, "password", 1234567890L, false, false, false, "Chennai, India", false);

        when(customerDao.getCustomer(customerId)).thenReturn(Optional.of(existingCustomer));
        when(customerDao.existsByEmail("new@example.com")).thenReturn(true);

        CustomerUpdateRequest updateRequest = new CustomerUpdateRequest("John Doe", "new@example.com", 1234567890L, "", false, "Chennai, India", false, false);

        assertThatThrownBy(() -> underTest.updateCustomer(updateRequest, customerId))
                .isInstanceOf(ResourceAlreadyExists.class)
                .hasMessage("Email already taken");

        verify(customerDao, never()).updateCustomer(any());
    }

    @Test
    void updateCustomerNoChangesFoundThrowsRequestValidationException() {
        long customerId = 1;
        String existingEmail = "existing@example.com";
        Customer existingCustomer = new Customer(customerId, "John Doe", existingEmail, "password", 1234567890L,
                "", false, "Chennai, India", false, false, false);

        when(customerDao.getCustomer(customerId)).thenReturn(Optional.of(existingCustomer));

        CustomerUpdateRequest updateRequest = new CustomerUpdateRequest("John Doe", existingEmail, 1234567890L, "",
                false, "Chennai, India", false, false);

        assertThatThrownBy(() -> underTest.updateCustomer(updateRequest, customerId))
                .isInstanceOf(RequestValidationException.class)
                .hasMessage("No data changes found");

        verify(customerDao, never()).updateCustomer(any());
    }


    @Test
    void deleteCustomerSuccessfullyDeletesCustomer() {
        long customerId = 1;
        Customer customer = new Customer(customerId, "testName", "test@example.com", "password", 20220292232L, false, false, false, "Chennai, India", false);
        when(customerDao.getCustomer(customerId)).thenReturn(Optional.of(customer));

        underTest.deleteCustomer(customerId);

        verify(customerDao).deleteCustomer(customer);
    }

    @Test
    void deleteCustomerNonExistingCustomerIdThrowsException() {
        long nonExistingCustomerId = 100;
        when(customerDao.getCustomer(nonExistingCustomerId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.deleteCustomer(nonExistingCustomerId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Customer with ID 100 not found");

        verify(customerDao).getCustomer(nonExistingCustomerId);
        verify(customerDao, never()).deleteCustomer(any());
    }

    @Test
    void addRole() {
        Role role = new Role("USER_ROLE");
        when(roleService.existsByName(role)).thenReturn(false);
        underTest.addRole(role);
        verify(roleService).saveRole(role);
    }


    @Test
    void addRoleThrowsIfRoleAlreadyExists() {
        Role role = new Role("USER_ROLE");
        when(roleService.existsByName(role)).thenReturn(true);
        assertThatThrownBy(() -> underTest.addRole(role)).isInstanceOf(ResourceAlreadyExists.class)
                .hasMessage("Role already exists");
        verify(roleService, never()).saveRole(any());
    }


    @Test
    void testAddRoleNullRoleThrowsException() {

        assertThatThrownBy(() -> underTest.addRole(null)).isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Role cannot be null");
        verify(roleService, never()).saveRole(any());
    }

    @Test
    void testRemoveRole() {
        Role role = new Role("USER_ROLE");
        when(roleService.findRoleById(role.getId())).thenReturn(role);
        underTest.removeRole(role.getId());
        verify(roleService).deleteRole(role.getId());
    }

    @Test
    void testRemoveRoleThrowsIfRoleIsNull() {
        assertThatThrownBy(() -> underTest.removeRole(null))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Role not found");
        verify(roleService, never()).deleteRole(any());
    }

    @Test
    void getRoles() {
        underTest.getRoles();
        verify(roleService).getAllRoles();
    }

    @Test
    void addMovieToCustomer() {
        Customer customer = new Customer(1L, "testName", "test@example.com", "password", 20220292232L, false, false, false, "Chennai, India", false);
        Movie movie = new Movie(1L, "testName", 230.00, 9.00, "none", "none", "none", 2000, "none", "none", "movies");

        when(customerDao.getCustomer(1L)).thenReturn(Optional.of(customer));
        when(movieDao.getMovieById(1L)).thenReturn(Optional.of(movie));

        underTest.addMovieToCustomer(customer.getId(), movie.getMovie_id());

        ArgumentCaptor<Customer> customerArgumentCaptor = ArgumentCaptor.forClass(Customer.class);

        verify(customerDao).updateCustomer(customerArgumentCaptor.capture());

        Customer updated = customerArgumentCaptor.getValue();

        assertThat(updated.getMovies()).contains(movie);

    }

    @Test
    void addMovieToCustomerThrowsIfMovieExists() {
        Customer customer = new Customer(1L, "testName", "test@example.com", "password", 20220292232L, false, false, false, "Chennai, India", false);
        Movie movie = new Movie(1L, "testName", 230.00, 9.00, "none", "none", "none", 2000, "none", "none", "movies");

        when(customerDao.getCustomer(1L)).thenReturn(Optional.of(customer));
        when(movieDao.getMovieById(1L)).thenReturn(Optional.of(movie));

        customer.setMovies(List.of(movie));

        assertThatThrownBy(() -> underTest.addMovieToCustomer(customer.getId(), movie.getMovie_id()))
                .isInstanceOf(ResourceAlreadyExists.class)
                .hasMessage("Customer " + customer.getId() + " already subscribed to movie " + movie.getMovie_id());

        verify(customerDao, never()).updateCustomer(any());
    }

    @Test
    void removeMovieFromCustomerRemovesMovieFromCustomer() {
        Customer customer = new Customer(1L, "testName", "test@example.com", "password", 20220292232L, false, false, false, "Chennai, India", false);
        Movie movie = new Movie(1L, "testMovie", 230.00, 9.00, "none", "none", "none", 2000, "none", "none", "movies");

        when(customerDao.getCustomer(1L)).thenReturn(Optional.of(customer));
        when(movieDao.getMovieById(1L)).thenReturn(Optional.of(movie));

        customer.addMovie(movie);

        assertThat(customer.getMovies()).contains(movie);

        underTest.removeMovieFromCustomer(1L, 1L);

        ArgumentCaptor<Customer> customerArgumentCaptor = ArgumentCaptor.forClass(Customer.class);
        verify(customerDao).updateCustomer(customerArgumentCaptor.capture());

        Customer updatedCustomer = customerArgumentCaptor.getValue();

        assertThat(updatedCustomer.getMovies()).doesNotContain(movie);
    }

    @Test
    void removeMovieFromCustomerThrowsResourceNotFoundExceptionNotFound() {
        Customer customer = new Customer(1L, "testName", "test@example.com", "password", 20220292232L, false, false, false, "Chennai, India", false);
        Movie movie = new Movie(1L, "testMovie", 230.00, 9.00, "none", "none", "none", 2000, "none", "none", "movies");

        when(customerDao.getCustomer(1L)).thenReturn(Optional.of(customer));
        when(movieDao.getMovieById(1L)).thenReturn(Optional.of(movie));

        assertThat(customer.getMovies()).doesNotContain(movie);

        assertThatThrownBy(() -> underTest.removeMovieFromCustomer(1L, 1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("not subscribed to");

        verify(customerDao, never()).updateCustomer(customer);
    }

    @Test
    void removeMovieFromCustomerCustomerNotFoundThrowsResourceNotFoundException() {
        when(customerDao.getCustomer(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.removeMovieFromCustomer(1L, 1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Customer with ID 1 not found");

        verify(movieDao, never()).getMovieById(1L);
    }

    @Test
    void getAllCustomers() {
        underTest.getAllCustomers();
        verify(customerDao).getCustomerList();
    }


    @Test
    public void testRemoveAllMovies_success() {
        Long customerId = 1L;
        Customer customer = new Customer();
        customer.setId(customerId);
        customer.setName("Test Customer");
        List<Movie> movies = new ArrayList<>();
        Movie movie1 = new Movie();
        movie1.setMovie_id(1L);
        movie1.setName("Movie 1");
        movies.add(movie1);
        customer.setMovies(movies);

        when(customerDao.getCustomer(customerId)).thenReturn(Optional.of(customer));

        // Call the service method
        underTest.removeAllMovies(customerId);

        // Verify
        verify(customerDao, times(1)).getCustomer(customerId);
        verify(customerDao, times(1)).updateCustomer(customer);
        assertEquals(0, customer.getMovies().size());
    }


    @Test
    public void testRemoveAllMovies_customerNotFound() {
        Long customerId = 1L;
        when(customerDao.getCustomer(customerId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.removeAllMovies(customerId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Customer with ID " + customerId + " not found");

        verify(customerDao, times(1)).getCustomer(customerId);
        verify(customerDao, never()).updateCustomer(any());
    }

    @Test
    public void testRemoveAllMovies_noMoviesToRemove() {
        Long customerId = 1L;
        Customer customer = new Customer();
        customer.setId(customerId);
        customer.setMovies(new ArrayList<Movie>());

        when(customerDao.getCustomer(customerId)).thenReturn(Optional.of(customer));

        assertThatThrownBy(() -> underTest.removeAllMovies(customerId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Customer " + customerId + " not subscribed to any movie");

        verify(customerDao, times(1)).getCustomer(customerId);
        verify(customerDao, never()).updateCustomer(any());
    }
}