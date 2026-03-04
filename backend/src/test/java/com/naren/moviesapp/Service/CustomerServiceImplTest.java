package com.naren.moviesapp.Service;

import com.naren.moviesapp.Dto.CustomerDTO;
import com.naren.moviesapp.Dto.CustomerDTOMapper;
import com.naren.moviesapp.Entity.Customer;
import com.naren.moviesapp.Entity.Movie;
import com.naren.moviesapp.Entity.Role;
import com.naren.moviesapp.Entity.RoleName;
import com.naren.moviesapp.Exception.RequestValidationException;
import com.naren.moviesapp.Exception.ResourceAlreadyExists;
import com.naren.moviesapp.Exception.ResourceNotFoundException;
import com.naren.moviesapp.Record.CustomerRegistration;
import com.naren.moviesapp.Record.CustomerUpdateRequest;
import com.naren.moviesapp.Repo.CustomerRepository;
import com.naren.moviesapp.Repo.MovieRepository;
import com.naren.moviesapp.Utils.OtpService;
import com.naren.moviesapp.jwt.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
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
    private CustomerRepository customerRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private RoleService roleService;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private MovieRepository movieRepository;

    private CustomerService underTest;

    @Mock
    private OtpService otpService;

    @BeforeEach
    void setUp() {
        underTest = new CustomerService(
                customerRepository, passwordEncoder, customerDTOMapper, roleService,
                movieRepository, jwtUtil, otpService);

    }

    @Test
    void registerCustomerSuccess() {
        String email = "test@example.com";
        String password = "password";
        String encodedPassword = passwordEncoder.encode(password);
        CustomerRegistration registration = new CustomerRegistration("test",
                email, password, "22222222222", "", false, "Chennai, India", false);

        when(customerRepository.existsByEmail(email)).thenReturn(false);
        when(customerRepository.existsByPhoneNumber(registration.phoneNumber())).thenReturn(false);
        when(passwordEncoder.encode(password)).thenReturn(encodedPassword);

        Role role = new Role(RoleName.valueOf("ROLE_USER"));
        when(roleService.findRoleByName(RoleName.ROLE_USER)).thenReturn(role);
        ResponseEntity<?> response = underTest.registerUser(registration, Set.of("ROLE_USER"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);

        ArgumentCaptor<Customer> customerArgumentCaptor = ArgumentCaptor.forClass(Customer.class);
        verify(customerRepository).save(customerArgumentCaptor.capture());

        Customer capturedCustomer = customerArgumentCaptor.getValue();
        assertThat(capturedCustomer.getEmail()).isEqualTo(email);
        assertThat(capturedCustomer.getName()).isEqualTo("test");
        assertThat(capturedCustomer.getPassword()).isEqualTo(encodedPassword);
        assertThat(capturedCustomer.getPhoneNumber()).isEqualTo("22222222222");
        assertThat(capturedCustomer.getIsEmailVerified()).isEqualTo(true);
        assertThat(capturedCustomer.getAddress()).isEqualTo("Chennai, India");
        verify(roleService).findRoleByName(RoleName.ROLE_USER);
        assertThat(capturedCustomer.getRoles()).contains(role);
        assertThat(response.getBody()).isEqualTo(customerDTOMapper.apply(capturedCustomer));
    }

    @Test
    void registerCustomerSuccess_withAdminRole_throwsAccessDenied() {
        String email = "admin@example.com";
        String password = "password";
        CustomerRegistration registration = new CustomerRegistration("admin",
                email, password, "22222222222", "", false, "Chennai, India", false);

        assertThatThrownBy(() -> underTest.registerUser(registration, Set.of("ROLE_ADMIN")))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessage("Invalid role assignment attempted during customer registration.");

        verify(customerRepository, never()).save(any());
    }

    @Test
    void registerCustomerSuccess_withSuperAdminRole_throwsAccessDenied() {
        String email = "superadmin@example.com";
        String password = "password";
        CustomerRegistration registration = new CustomerRegistration("superadmin",
                email, password, "22222222222", "", false, "Chennai, India", false);

        assertThatThrownBy(() -> underTest.registerUser(registration, Set.of("ROLE_SUPER_ADMIN")))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessage("Invalid role assignment attempted during customer registration.");

        verify(customerRepository, never()).save(any());
    }

    @Test
    void registerUser_InvalidRoleName_ReturnsAccessDenied() {

        CustomerRegistration registration = new CustomerRegistration("John Doe", "johndoe@example.com", "password", "1234567890", "", false, "Chennai, India", false);
        Set<String> roleNames = new HashSet<>();
        roleNames.add("NON_EXISTENT_ROLE");

        assertThatThrownBy(() -> underTest.registerUser(registration, roleNames))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("Invalid role assignment attempted during customer registration.");
    }

    @Test
    void registerCustomerPersonalInfoInPasswordThrowsAccessDeniedException() {
        CustomerRegistration registration = new CustomerRegistration("testName", "testEmail", "testName123", "1234567890", "", false, "Chennai, India", false);

        assertThatThrownBy(() -> underTest.registerUser(registration, Set.of()))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessage("Invalid role assignment attempted during customer registration.");

        verify(customerRepository, never()).save(any());
    }

    @Test
    void registerCustomerInvalidPasswordLengthThrowsAccessDeniedException() {
        CustomerRegistration registration = new CustomerRegistration("testName", "test@example.com", "pass", "20220292232", "", false, "Chennai, India", false);

        assertThatThrownBy(() -> underTest.registerUser(registration, Set.of()))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessage("Invalid role assignment attempted during customer registration.");

        verify(customerRepository, never()).save(any());
    }

    @Test
    void registerCustomerEmailAlreadyExistsThrowsAccessDeniedException() {
        String email = "test@example.com";
        CustomerRegistration registration = new CustomerRegistration("John Doe", email, "SecurePass123!", "20220292232", "", false, "Chennai, India", false);

        assertThatThrownBy(() -> underTest.registerUser(registration, Set.of()))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessage("Invalid role assignment attempted during customer registration.");

        verify(customerRepository, never()).save(any());
    }

    @Test
    void registerCustomerPhoneNumberAlreadyExistsThrowsAccessDeniedException() {

        CustomerRegistration registration =
                new CustomerRegistration("Jane Smith", "test@example.com",
                        "MySecure@Pass123", "1234567890", "", false, "Chennai, India", false);

        assertThatThrownBy(() -> underTest.registerUser(registration, Set.of()))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessage("Invalid role assignment attempted during customer registration.");

        verify(customerRepository, never()).save(any());
    }

    @Test
    void getCustomerByIdReturnsCustomerDTO() {
        long customerId = 1;
        Customer customer = new Customer(customerId, "Alex", "alex@example.com",
                "password", "1234567890", false, false, "Chennai, India", false);
        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));

        CustomerDTO result = underTest.getCustomerById(customerId);

        assertThat(result).isNotNull();
        assertThat(result.name()).isEqualTo("Alex");
        assertThat(result.email()).isEqualTo("alex@example.com");
        assertThat(result.phoneNumber()).isEqualTo("1234567890");
    }

    @Test
    void getCustomerByIdNonExistingCustomerIdThrowsException() {
        long nonExistingCustomerId = 100;
        when(customerRepository.findById(nonExistingCustomerId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.getCustomerById(nonExistingCustomerId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Customer with ID 100 not found");

        verify(customerRepository).findById(nonExistingCustomerId);
    }

    @Test
    void updateCustomerSuccessful() {
        long customerId = 1;
        Customer customer = new Customer(customerId, "testName", "test@example.com", "oldPassword", "20220292232", false, false, "Chennai, India", false);
        CustomerUpdateRequest updateRequest = new CustomerUpdateRequest("newName", "new@example.com", "9999999999", "", false, "Chennai, India", false);

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));
        when(customerRepository.existsByEmail(updateRequest.email())).thenReturn(false);

        underTest.updateCustomer(updateRequest, customerId);

        ArgumentCaptor<Customer> customerArgumentCaptor = ArgumentCaptor.forClass(Customer.class);
        verify(customerRepository).save(customerArgumentCaptor.capture());

        Customer updatedCustomer = customerArgumentCaptor.getValue();
        assertThat(updatedCustomer.getName()).isEqualTo("newName");
        assertThat(updatedCustomer.getEmail()).isEqualTo("new@example.com");
        assertThat(updatedCustomer.getPhoneNumber()).isEqualTo("9999999999");
    }

    @Test
    void updateCustomerNonExistingCustomerIdThrowsException() {
        long nonExistingCustomerId = 100;
        CustomerUpdateRequest updateRequest = new CustomerUpdateRequest("newName", "new@example.com", "9999999999", "", false, "Chennai, India", false);

        when(customerRepository.findById(nonExistingCustomerId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.updateCustomer(updateRequest, nonExistingCustomerId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Customer with ID 100 not found");

        verify(customerRepository).findById(nonExistingCustomerId);
        verify(customerRepository, never()).save(any());
    }

    @Test
    void updateCustomerEmailAlreadyExistsThrowsResourceAlreadyExists() {
        long customerId = 1;
        String existingEmail = "existing@example.com";
        Customer existingCustomer = new Customer(customerId, "John Doe", existingEmail, "password", "1234567890", false, false, "Chennai, India", false);

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(existingCustomer));
        when(customerRepository.existsByEmail("new@example.com")).thenReturn(true);

        CustomerUpdateRequest updateRequest = new CustomerUpdateRequest("John Doe", "new@example.com", "1234567890", "", false, "Chennai, India", false);

        assertThatThrownBy(() -> underTest.updateCustomer(updateRequest, customerId))
                .isInstanceOf(ResourceAlreadyExists.class)
                .hasMessage("Email already taken");

        verify(customerRepository, never()).save(any());
    }

    @Test
    void updateCustomerNoChangesFoundThrowsRequestValidationException() {
        long customerId = 1;
        String existingEmail = "existing@example.com";
        Customer existingCustomer = new Customer(customerId, "John Doe", existingEmail, "password", "1234567890",
                "", false, "Chennai, India", false, false);

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(existingCustomer));

        CustomerUpdateRequest updateRequest = new CustomerUpdateRequest("John Doe", existingEmail, "1234567890", "",
                false, "Chennai, India", false);

        assertThatThrownBy(() -> underTest.updateCustomer(updateRequest, customerId))
                .isInstanceOf(RequestValidationException.class)
                .hasMessage("No data changes found");

        verify(customerRepository, never()).save(any());
    }


    @Test
    void deleteCustomerSuccessfullyDeletesCustomer() {
        long customerId = 1;
        Customer customer = new Customer(customerId, "testName", "test@example.com", "password", "20220292232", false, false, "Chennai, India", false);
        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));

        underTest.deleteCustomer(customerId);

        verify(customerRepository).delete(customer);
    }

    @Test
    void deleteCustomerNonExistingCustomerIdThrowsException() {
        long nonExistingCustomerId = 100;
        when(customerRepository.findById(nonExistingCustomerId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.deleteCustomer(nonExistingCustomerId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Customer with ID 100 not found");

        verify(customerRepository).findById(nonExistingCustomerId);
        verify(customerRepository, never()).delete(any());
    }

    @Test
    void addRole() {
        Role role = new Role(RoleName.valueOf("ROLE_USER"));
        when(roleService.existsByName(role)).thenReturn(false);
        underTest.addRole(role);
        verify(roleService).saveRole(role);
    }

    @Test
    void addRole_superAdmin() {
        Role role = new Role(RoleName.valueOf("ROLE_SUPER_ADMIN"));
        when(roleService.existsByName(role)).thenReturn(false);
        underTest.addRole(role);
        verify(roleService).saveRole(role);
    }

    @Test
    void addRole_contentManager() {
        Role role = new Role(RoleName.valueOf("ROLE_CONTENT_MANAGER"));
        when(roleService.existsByName(role)).thenReturn(false);
        underTest.addRole(role);
        verify(roleService).saveRole(role);
    }

    @Test
    void addRole_support() {
        Role role = new Role(RoleName.valueOf("ROLE_SUPPORT"));
        when(roleService.existsByName(role)).thenReturn(false);
        underTest.addRole(role);
        verify(roleService).saveRole(role);
    }


    @Test
    void addRoleThrowsIfRoleAlreadyExists() {
        Role role = new Role(RoleName.valueOf("ROLE_USER"));
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
        Role role = new Role(RoleName.valueOf("ROLE_USER"));
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
        Customer customer = new Customer(1L, "testName", "test@example.com", "password", "20220292232", false, false, "Chennai, India", false);
        Movie movie = new Movie(
                "testName",
                9.00,
                "none",
                "none",
                "none",
                2000,
                "none",
                "none",
                "movies", "General");
        movie.setId(1L);

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));

        underTest.addMovieToCustomer(customer.getId(), movie.getId());

        ArgumentCaptor<Customer> customerArgumentCaptor = ArgumentCaptor.forClass(Customer.class);

        verify(customerRepository).save(customerArgumentCaptor.capture());

        Customer updated = customerArgumentCaptor.getValue();

        assertThat(updated.getMovies()).contains(movie);

    }

    @Test
    void addMovieToCustomerThrowsIfMovieExists() {
        Customer customer = new Customer(1L, "testName", "test@example.com", "password", "20220292232", false, false, "Chennai, India", false);
        Movie movie = new Movie(
                "testName",
                9.00,
                "none",
                "none",
                "none",
                2000,
                "none",
                "none",
                "movies", "General");
        movie.setId(1L);

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));

        customer.setMovies(List.of(movie));

        assertThatThrownBy(() -> underTest.addMovieToCustomer(customer.getId(), movie.getId()))
                .isInstanceOf(ResourceAlreadyExists.class)
                .hasMessage("Customer " + customer.getId() + " already subscribed to movie " + movie.getId());

        verify(customerRepository, never()).save(any());
    }

    @Test
    void removeMovieFromCustomerRemovesMovieFromCustomer() {
        Customer customer = new Customer(1L, "testName", "test@example.com", "password", "20220292232", false, false, "Chennai, India", false);
        Movie movie = new Movie(
                "testMovie",
                9.00,
                "none",
                "none",
                "none",
                2000,
                "none",
                "none",
                "movies", "General");
        movie.setId(1L);

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));

        customer.addMovie(movie);

        assertThat(customer.getMovies()).contains(movie);

        underTest.removeMovieFromCustomer(1L, 1L);

        ArgumentCaptor<Customer> customerArgumentCaptor = ArgumentCaptor.forClass(Customer.class);
        verify(customerRepository).save(customerArgumentCaptor.capture());

        Customer updatedCustomer = customerArgumentCaptor.getValue();

        assertThat(updatedCustomer.getMovies()).doesNotContain(movie);
    }

    @Test
    void removeMovieFromCustomerThrowsResourceNotFoundExceptionNotFound() {
        Customer customer = new Customer(1L, "testName", "test@example.com", "password", "20220292232", false, false, "Chennai, India", false);
        Movie movie = new Movie(
                "testMovie",
                9.00,
                "none",
                "none",
                "none",
                2000,
                "none",
                "none",
                "movies", "General");
        movie.setId(1L);

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(movieRepository.findById(1L)).thenReturn(Optional.of(movie));

        assertThat(customer.getMovies()).doesNotContain(movie);

        assertThatThrownBy(() -> underTest.removeMovieFromCustomer(1L, 1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("not subscribed to");

        verify(customerRepository, never()).save(customer);
    }

    @Test
    void removeMovieFromCustomerCustomerNotFoundThrowsResourceNotFoundException() {
        when(customerRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.removeMovieFromCustomer(1L, 1L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Customer with ID 1 not found");

        verify(movieRepository, never()).findById(1L);
    }

    @Test
    void getAllCustomers() {
        when(customerRepository.findAll(any(org.springframework.data.domain.Pageable.class)))
                .thenReturn(new org.springframework.data.domain.PageImpl<>(List.of()));

        underTest.getAllCustomers();
        verify(customerRepository).findAll(org.springframework.data.domain.PageRequest.of(0, 20));
    }


    @Test
    public void testRemoveAllMovies_success() {
        Long customerId = 1L;
        Customer customer = new Customer();
        customer.setId(customerId);
        customer.setName("Test Customer");
        List<Movie> movies = new ArrayList<>();
        Movie movie1 = new Movie();
        movie1.setId(1L);
        movie1.setName("Movie 1");
        movies.add(movie1);
        customer.setMovies(movies);

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));

        // Call the service method
        underTest.removeAllMovies(customerId);

        // Verify
        verify(customerRepository, times(1)).findById(customerId);
        verify(customerRepository, times(1)).save(customer);
        assertEquals(0, customer.getMovies().size());
    }


    @Test
    public void testRemoveAllMovies_customerNotFound() {
        Long customerId = 1L;
        when(customerRepository.findById(customerId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> underTest.removeAllMovies(customerId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Customer with ID " + customerId + " not found");

        verify(customerRepository, times(1)).findById(customerId);
        verify(customerRepository, never()).save(any());
    }

    @Test
    public void testRemoveAllMovies_noMoviesToRemove() {
        Long customerId = 1L;
        Customer customer = new Customer();
        customer.setId(customerId);
        customer.setMovies(new ArrayList<Movie>());

        when(customerRepository.findById(customerId)).thenReturn(Optional.of(customer));

        assertThatThrownBy(() -> underTest.removeAllMovies(customerId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Customer " + customerId + " not subscribed to any movie");

        verify(customerRepository, times(1)).findById(customerId);
        verify(customerRepository, never()).save(any());
    }
}